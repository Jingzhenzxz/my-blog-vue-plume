---
title: 删除字符串中的所有相邻重复项 II
createTime: 2025/02/24 17:23:38
permalink: /article/39i07dum/
tags:
  - 贪心

---
## [1209. 删除字符串中的所有相邻重复项 II](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string-ii/)

给你一个字符串 `s`，「`k` 倍重复项删除操作」将会从 `s` 中选择 `k` 个相邻且相等的字母，并删除它们，使被删去的字符串的左侧和右侧连在一起。

你需要对 `s` 重复进行无限次这样的删除操作，直到无法继续为止。

在执行完所有删除操作后，返回最终得到的字符串。

本题答案保证唯一。

**示例 1：**

```
输入：s = "abcd", k = 2
输出："abcd"
解释：没有要删除的内容。
```

**示例 2：**

```
输入：s = "deeedbbcccbdaa", k = 3
输出："aa"
解释： 
先删除 "eee" 和 "ccc"，得到 "ddbbbdaa"
再删除 "bbb"，得到 "dddaa"
最后删除 "ddd"，得到 "aa"
```

**示例 3：**

```
输入：s = "pbbcggttciiippooaais", k = 2
输出："ps"
```

**提示：**

- `1 <= s.length <= 10^5`
- `2 <= k <= 10^4`
- `s` 中只含有小写英文字母。

## 贪心+记忆数组

在遍历字符串的过程中维护出现次数数组，计算完就操作。

```java
public String removeDuplicates(String s, int k) {
    // 创建一个可变的字符串 StringBuilder，用于高效操作字符串。重点。
    StringBuilder sb = new StringBuilder(s);
    
    // 创建一个数组，用于记录每个字符连续出现的次数
    int count[] = new int[sb.length()];
    
    // 遍历整个字符串
    for (int i = 0; i < sb.length(); ++i) {
        // 如果是第一个字符，或者当前字符和前一个字符不同
        if (i == 0 || sb.charAt(i) != sb.charAt(i - 1)) {
            // 将当前字符的计数置为 1
            count[i] = 1;
        } else {
            // 否则，当前字符与前一个字符相同
            // 将当前字符的计数值设为前一个字符的计数加 1。重点。类似前缀和数组，即当前位置的信息包含历史信息。
            count[i] = count[i - 1] + 1;
            // 加完，如果当前字符的计数值等于 k，就需要删除操作。这里是贪心策略，即只和历史有关，和未来无关。局部最优。
            if (count[i] == k) {
                // 从字符串中删除这 k 个连续相同的字符，左闭右开
                sb.delete(i - k + 1, i + 1);
                // 更新 i 的值，使其指向上一个有效字符的位置
                // 例如，如果删除了 k 个字符，i 需要向前移动 k 位。重点。
                i = i - k;
                // 解释：例如之前的字符串是 "baaacd"，当前 i = 3，指向 "a"
                // 删除 "aaa" 后，i = 3 - 3 = 0，此时指向 "b"
                // 然后在 for 循环中会执行 ++i，i 最终等于 1，指向 "c"
            }
        }
    }
    
    // 返回删除重复字符后的最终字符串
    return sb.toString();
}
```

- 时间复杂度：O(n)，其中 n 是字符串长度。每个字符仅被处理一次。
- 空间复杂度：O(n)，存储每个字符的计数器。